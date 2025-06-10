export class Document {
  id: number;
  goalId?: number;
  projectId?: number;
  name: string;
  type: string;
  uploadDate: Date;

  constructor(
    id: number,
    options: { goalId?: number; projectId?: number },
    name: string,
    type: string,
    uploadDate: Date
  ) {
    this.id = id;
    this.goalId = options.goalId;
    this.projectId = options.projectId;
    this.name = name;
    this.type = type;
    this.uploadDate = uploadDate;
  }
}
