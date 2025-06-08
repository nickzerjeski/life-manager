export class Document {
  id: number;
  goalId: number;
  name: string;
  type: string;
  uploadDate: Date;

  constructor(id: number, goalId: number, name: string, type: string, uploadDate: Date) {
    this.id = id;
    this.goalId = goalId;
    this.name = name;
    this.type = type;
    this.uploadDate = uploadDate;
  }
}
