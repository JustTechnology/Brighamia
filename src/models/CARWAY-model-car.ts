export class CARWAY_Model_Car
{
    public m_sCarID?:string = "";
    public m_sCarName?:string = "";
    public m_sPassword?: string = "";
    public m_sPictureURL?:string = "";
    public m_sArrayFlotte:Array<string>;
    
    constructor()
    {
        console.log("construct CARWAY_Model_Car");
    }
}