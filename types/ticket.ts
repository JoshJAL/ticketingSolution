export type Ticket = {
  id: number;
  title: string;
  description: string;
  picture: string;
  priority_level: number;
  status: string;
  assigned_to: string;
  complexity_level: string;
  reviewed_by: string;
  notes: string;
  created_by: string;
  ticketType: TicketType;
};

enum TicketType {
  Story = 'Story',
  Bug = 'Bug',
  Task = 'Task',
  SubTask = 'Sub-task',
  Epic = 'Epic',
}