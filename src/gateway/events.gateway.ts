import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    client.join(`project:${projectId}`);
    return { event: 'joinedProject', data: projectId };
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    client.leave(`project:${projectId}`);
    return { event: 'leftProject', data: projectId };
  }

  @SubscribeMessage('joinTeam')
  handleJoinTeam(
    @ConnectedSocket() client: Socket,
    @MessageBody() teamId: string,
  ) {
    client.join(`team:${teamId}`);
    return { event: 'joinedTeam', data: teamId };
  }

  emitTaskCreated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('taskCreated', task);
  }

  emitTaskUpdated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('taskUpdated', task);
  }

  emitTaskDeleted(projectId: string, taskId: string) {
    this.server.to(`project:${projectId}`).emit('taskDeleted', { taskId });
  }

  emitStatusChanged(
    projectId: string,
    taskId: string,
    status: string,
    userId: string,
  ) {
    this.server.to(`project:${projectId}`).emit('statusChanged', {
      taskId,
      status,
      changedBy: userId,
    });
  }

  emitCommentAdded(projectId: string, taskId: string, comment: any) {
    this.server.to(`project:${projectId}`).emit('commentAdded', {
      taskId,
      comment,
    });
  }

  emitTeamMemberAdded(teamId: string, member: any) {
    this.server.to(`team:${teamId}`).emit('memberAdded', member);
  }

  emitTeamMemberRemoved(teamId: string, memberId: string) {
    this.server.to(`team:${teamId}`).emit('memberRemoved', { memberId });
  }
}
