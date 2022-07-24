import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import Document from './document';

@Table({ tableName: 'users', timestamps: true })
class User extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4, })
  id: string;
  @Column({ allowNull: false })
  googleId: string;
  @Column({ allowNull: false })
  name: string;
  @Column({ allowNull: true })
  email: string;
  @Column({ allowNull: true })
  picture: string;
  @HasMany(() => Document)
  documents: Document[];
  @Column({ defaultValue: false })
  admin: boolean;
  @Column({ defaultValue: false })
  disabled: boolean;
}

export default User