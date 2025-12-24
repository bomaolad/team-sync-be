import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private teamsService: TeamsService,
  ) {}

  create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    return this.teamsService
      .getMembers(createProjectDto.teamId)
      .then((members) => {
        const isMember = members.some((m) => m.userId === userId);
        if (!isMember) {
          throw new ForbiddenException('Not a member of this team');
        }
        const project = this.projectsRepository.create(createProjectDto);
        return this.projectsRepository.save(project);
      });
  }

  findAll(query: ProjectQueryDto, userId: string): Promise<Project[]> {
    return this.teamsService.findAllByUser(userId).then((teams) => {
      const teamIds = teams.map((t) => t.id);

      const queryBuilder = this.projectsRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.team', 'team')
        .where('project.teamId IN (:...teamIds)', {
          teamIds: teamIds.length ? teamIds : [''],
        });

      if (query.teamId) {
        queryBuilder.andWhere('project.teamId = :teamId', {
          teamId: query.teamId,
        });
      }
      if (query.status) {
        queryBuilder.andWhere('project.status = :status', {
          status: query.status,
        });
      }

      return queryBuilder.orderBy('project.createdAt', 'DESC').getMany();
    });
  }

  findOne(id: string): Promise<Project> {
    return this.projectsRepository
      .findOne({
        where: { id },
        relations: ['team'],
      })
      .then((project) => {
        if (!project) {
          throw new NotFoundException('Project not found');
        }
        return project;
      });
  }

  update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    return this.findOne(id)
      .then((project) =>
        this.checkMemberAccess(project.teamId, userId).then(() => project),
      )
      .then(() => this.projectsRepository.update(id, updateProjectDto))
      .then(() => this.findOne(id));
  }

  remove(id: string, userId: string): Promise<void> {
    return this.findOne(id)
      .then((project) =>
        this.checkAdminAccess(project.teamId, userId).then(() => project),
      )
      .then(() => this.projectsRepository.delete(id))
      .then(() => undefined);
  }

  private checkMemberAccess(teamId: string, userId: string): Promise<void> {
    return this.teamsService.getMembers(teamId).then((members) => {
      const isMember = members.some((m) => m.userId === userId);
      if (!isMember) {
        throw new ForbiddenException('Not a member of this team');
      }
    });
  }

  private checkAdminAccess(teamId: string, userId: string): Promise<void> {
    return this.teamsService.getMembers(teamId).then((members) => {
      const isAdmin = members.some(
        (m) => m.userId === userId && m.role === 'ADMIN',
      );
      if (!isAdmin) {
        throw new ForbiddenException('Admin access required');
      }
    });
  }
}
