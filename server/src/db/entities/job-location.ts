import { Column } from "typeorm"

export default class JobLocation {

    @Column({
        nullable: true
    })
    streetNumber: string

    @Column({
        nullable: true
    })
    streetName: string

    @Column({
        nullable: true
    })
    city: string

    @Column({
        nullable: true
    })
    district: string

    @Column({
        nullable: true
    })
    country: string

    @Column({
        nullable: true
    })
    zipcode: string
}
