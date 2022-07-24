import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import User from './user';

@Table({ tableName: 'documents', timestamps: true })
class Document extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4, })
  id: string;
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
  @Column({ allowNull: false })
  data: string;
}

export default Document
