import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'images' })
export class ImagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData1: Buffer;

  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData2: Buffer;

  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData3: Buffer;

  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData4: Buffer;

  
  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData5: Buffer;

  
  @IsOptional()
  @Column('bytea', { nullable: true })
  imageData6: Buffer;


  @ManyToOne(() => ProductsEntity, product => product.images)
  @JoinColumn({ name: 'product_id' }) // Especifica el nombre del campo en la tabla
  product: ProductsEntity;


}