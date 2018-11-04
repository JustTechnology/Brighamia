import { CARWAY_Model_Car } from "./CARWAY-model-car";

export class CARWAY_Model_Pool
{
    public m_sIDPool:string = "";
    public m_ArrayCarwayModelCar:Array<CARWAY_Model_Car>;
    public m_nActiveCar:number = 0;

    constructor()
    {
        console.log("construct CARWAY_Model_Pool");
    }
}
