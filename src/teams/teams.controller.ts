import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  JoinTeamDto,
  InviteMemberDto,
  UpdateMemberRoleDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Request() req: any) {
    return this.teamsService.create(createTeamDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.teamsService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Request() req: any,
  ) {
    return this.teamsService.update(id, updateTeamDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.remove(id, req.user.sub);
  }

  @Post('join')
  join(@Body() joinTeamDto: JoinTeamDto, @Request() req: any) {
    return this.teamsService.joinByInviteCode(joinTeamDto, req.user.sub);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.teamsService.getMembers(id);
  }

  @Post(':id/invite')
  inviteMember(
    @Param('id') id: string,
    @Body() inviteDto: InviteMemberDto,
    @Request() req: any,
  ) {
    return this.teamsService.inviteMember(
      id,
      inviteDto.email,
      inviteDto.role || 'MEMBER',
      req.user.sub,
    );
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ) {
    return this.teamsService.removeMember(id, memberId, req.user.sub);
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateRoleDto: UpdateMemberRoleDto,
    @Request() req: any,
  ) {
    return this.teamsService.updateMemberRole(
      id,
      memberId,
      updateRoleDto.role,
      req.user.sub,
    );
  }

  @Post(':id/regenerate-code')
  regenerateInviteCode(@Param('id') id: string, @Request() req: any) {
    return this.teamsService.regenerateInviteCode(id, req.user.sub);
  }
}
