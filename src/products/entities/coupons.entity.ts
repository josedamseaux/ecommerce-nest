import { BaseEntity } from "../../config/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'coupons' })
export class CouponsEntity extends BaseEntity {

    @Column()
    name: string;

    @Column()
    code: string;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    discountPercentage: number; // Porcentaje de descuento

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    discountAmount: number; // Monto del descuento

    @Column({ type: 'integer', default: 0, nullable: true })
    maxUsesPerUser: number; // Límite de usos por usuario

    @Column({ type: 'boolean', default: false, nullable: true })
    isActive: boolean; // Estado del cupón: activo o inactivo

    @Column({ type: 'jsonb', nullable: true })
    eligibleProducts: string[]; // Productos específicos elegibles para el descuento

    @Column({ type: 'timestamp', nullable: true })
    expirationDate: Date; // Fecha de expiración del cupón

    @Column({ nullable: true })
    uses: number;

    @Column({ type: 'jsonb', nullable: true })
    usedBy: string[]; // Array of users that've used the coupon
}