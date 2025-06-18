export class Document {
  id: string;
  goalId?: string;
  projectId?: string;
  name: string;
  type: string;
  uploadDate: Date;

  constructor(
    id: string,
    options: { goalId?: string; projectId?: string },
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
