import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import User from './user';

@Table({ tableName: 'documents', underscored: true, timestamps: false })
class Document extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4, })
  id: string;
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
  @Column({ allowNull: false })
  name: string;
  @Column({ type: DataType.JSON, allowNull: false })
  data: string;
  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;
  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}

export default Document
