import {Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";

export type MyContext = { //This complains if no equal sign.  Not sure why or if needed, (makes sense you would need one)
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}
