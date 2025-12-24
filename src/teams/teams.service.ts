import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team, TeamMember } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto, JoinTeamDto } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMembersRepository: Repository<TeamMember>,
    private usersService: UsersService,
  ) {}

  create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const inviteCode = uuidv4().substring(0, 8).toUpperCase();
    const team = this.teamsRepository.create({
      ...createTeamDto,
      ownerId: userId,
      inviteCode,
    });

    return this.teamsRepository.save(team).then((savedTeam) => {
      const member = this.teamMembersRepository.create({
        teamId: savedTeam.id,
        userId,
        role: 'ADMIN',
      });
      return this.teamMembersRepository.save(member).then(() => savedTeam);
    });
  }

  findAllByUser(userId: string): Promise<Team[]> {
    return this.teamMembersRepository
      .find({
        where: { userId },
        relations: ['team', 'team.owner'],
      })
      .then((memberships) => memberships.map((m) => m.team));
  }

  findOne(id: string): Promise<Team | null> {
    return this.teamsRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user'],
    });
  }

  update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    userId: string,
  ): Promise<Team> {
    return this.findOne(id)
      .then((team) => {
        if (!team) {
          throw new NotFoundException('Team not found');
        }
        if (team.ownerId !== userId) {
          throw new ForbiddenException('Only owner can update team');
        }
        return this.teamsRepository.update(id, updateTeamDto);
      })
      .then(() => this.findOne(id) as Promise<Team>);
  }

  remove(id: string, userId: string): Promise<void> {
    return this.findOne(id)
      .then((team) => {
        if (!team) {
          throw new NotFoundException('Team not found');
        }
        if (team.ownerId !== userId) {
          throw new ForbiddenException('Only owner can delete team');
        }
        return this.teamsRepository.delete(id);
      })
      .then(() => undefined);
  }

  joinByInviteCode(
    joinTeamDto: JoinTeamDto,
    userId: string,
  ): Promise<TeamMember> {
    return this.teamsRepository
      .findOne({ where: { inviteCode: joinTeamDto.inviteCode } })
      .then((team) => {
        if (!team) {
          throw new NotFoundException('Invalid invite code');
        }
        return this.teamMembersRepository
          .findOne({
            where: { teamId: team.id, userId },
          })
          .then((existingMember) => {
            if (existingMember) {
              throw new ConflictException('Already a member of this team');
            }
            const member = this.teamMembersRepository.create({
              teamId: team.id,
              userId,
              role: 'MEMBER',
            });
            return this.teamMembersRepository.save(member);
          });
      });
  }

  inviteMember(
    teamId: string,
    email: string,
    role: string,
    inviterId: string,
  ): Promise<TeamMember> {
    return this.checkAdminAccess(teamId, inviterId)
      .then(() => this.usersService.findByEmail(email))
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return this.teamMembersRepository
          .findOne({
            where: { teamId, userId: user.id },
          })
          .then((existingMember) => {
            if (existingMember) {
              throw new ConflictException('User is already a member');
            }
            const member = this.teamMembersRepository.create({
              teamId,
              userId: user.id,
              role: role || 'MEMBER',
            });
            return this.teamMembersRepository.save(member);
          });
      });
  }

  removeMember(
    teamId: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    return this.checkAdminAccess(teamId, userId)
      .then(() => this.teamMembersRepository.delete({ id: memberId, teamId }))
      .then(() => undefined);
  }

  updateMemberRole(
    teamId: string,
    memberId: string,
    role: string,
    userId: string,
  ): Promise<TeamMember> {
    return this.checkAdminAccess(teamId, userId)
      .then(() =>
        this.teamMembersRepository.update({ id: memberId, teamId }, { role }),
      )
      .then(
        () =>
          this.teamMembersRepository.findOne({
            where: { id: memberId },
          }) as Promise<TeamMember>,
      );
  }

  getMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMembersRepository.find({
      where: { teamId },
      relations: ['user'],
    });
  }

  regenerateInviteCode(teamId: string, userId: string): Promise<Team> {
    return this.checkAdminAccess(teamId, userId)
      .then(() => {
        const newCode = uuidv4().substring(0, 8).toUpperCase();
        return this.teamsRepository.update(teamId, { inviteCode: newCode });
      })
      .then(() => this.findOne(teamId) as Promise<Team>);
  }

  private checkAdminAccess(teamId: string, userId: string): Promise<void> {
    return this.teamMembersRepository
      .findOne({
        where: { teamId, userId },
      })
      .then((member) => {
        if (!member || member.role !== 'ADMIN') {
          throw new ForbiddenException('Admin access required');
        }
      });
  }
}
