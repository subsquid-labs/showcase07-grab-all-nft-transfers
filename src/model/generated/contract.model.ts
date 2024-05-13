import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Transfer} from "./transfer.model"

@Entity_()
export class Contract {
    constructor(props?: Partial<Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    deploymentHeight!: number

    @Index_()
    @StringColumn_({nullable: false})
    deploymentTxn!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @BooleanColumn_({nullable: false})
    isAErc721Duck!: boolean

    @OneToMany_(() => Transfer, e => e.contract)
    transfers!: Transfer[]
}
