import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({
    name: "spenders"
})
export default class Spender {

    @PrimaryGeneratedColumn()
    id: number

}
