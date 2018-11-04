export const GlobalConstants = Object.freeze(
{
	CARWAY_loginBaseUrl:'www.CarWay.de/Kennzeichen/',
	
	CARWAY_MARKER_66 :"assets/images/background/App66_logo.png",
	CARWAY_baseURL_Models: "1_Autos",
	CARWAY_baseURL_Signs: "2_Kennzeichen",
	CARWAY_baseURL_Pool:"3_Flotte",
	CARWAY_baseURL_Route: "4_Routen",
	CARWAY_baseURL_ServiceStruct:  "ServiceStruct",
	CARWAY_baseURL_Track:"Tracks",
	CARWAY_baseURL_Var_Days: "m_arrayCARWAY_Model_Day",
	CARWAY_baseURL_Var_Track: "m_arrayCARWAY_Model_Track_Single",
	CARWAY_baseURL_Var_Service: "m_arrayCARWAY_Model_Service",
	CARWAY_baseURL_Var_Service_Item: "m_arrayCARWAY_Model_Service_Item",
	CARWAY_baseURL_Var_Service_Item_PictureArray: "m_ArrayPictures",
	
	CARWAY_Password_Timeout : 10000,

	CARWAY_STORAGE_ACT_SIGN : "CARWAY_ACT_SIGN_22",
	CARWAY_baseURL_Example_Car : "assets/imgs/gelbesAuto.png",

	NOT_SET: -1,
// dfpfh
	CARWAY_baseURL_KFZ_FABRIKAT:"/1_KFZ_DB/1_car_make",
	CARWAY_baseURL_KFZ_MODELL:"/1_KFZ_DB/2_car_model",
	CARWAY_baseURL_KFZ_GENERATION:"/1_KFZ_DB/3_car_generation",
	CARWAY_baseURL_KFZ_MOTORISIERUNG:"/1_KFZ_DB/4_car_trim",
	CARWAY_REGEXP_EMAIL:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

	// => http://regexlib.com/Search.aspx?k=password&c=-1&m=5&ps=20
	//Validates a strong password. It must be between 8 and 10 characters, contain at least one digit and one alphabetic character, and must not contain special characters
	CARWAY_REGEXP_PASSWORD:/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,15})$/,

	CARWAY_STORAGE_KEY: 'CARWAY_SETTINGS',

	CARWAY_ROUTE_STANDARDTEXT_TITLE : "Titel",
	CARWAY_ROUTE_STANDARDTEXT_COMMENT : "Kommentar",
	CARWAY_ROUTE_STANDARDTEXT_AKTIONEN : "Aktionen",
	CARWAY_ROUTE_STANDARDTEXT_REPORT : "Report",
	CARWAY_ROUTE_STANDARDTEXT_ZIELPOSITION: "Zielposition",
	CARWAY_ROUTE_STANDARDTEXT_STARTPOSITION: "Startposition",
	
	CARWAY_TANKEN: ["Aral","Shell","Total","Esso","Avia","Jet","Raiffeisen","Agip","HEM","BFT","OMV","Westfalen","Hoyer","Q1","Classic"],

	CARWAY_COUNT_DEFAULT_SERVICES : 3,
});


export enum CARWAY_ACTIONS
{
  CARWAY_ACTION_GASOLINE
}

export enum CARWAY_TIME_PARTS
{
	HOUR = 0,
	MINUTE = 1
}
export enum CARWAY_EDIT_TYPE
{
  NOT_SET,
	NEW,
	WIZARD,
  SINGLE
}

export enum CARWAY_EDIT_STATE
{
  NOT_SET,
	TITLE,
	START,
  ZIEL,
  KOMMENTAR,
  AKTION
}

export enum CARWAY_KEY_TYPE
{
  NOT_SET,
	DATE,
	TIME
}

export enum CARWAY_WIZARD_OBJECT
{
  NOT_SET = "NOT_SET",
	TEXT = "TEXT",
	SELECT = "SELECT",
	TIME = "TIME",
	LOCATION = "LOCATION",
	COSTS = "COSTS"
}

export enum CARWAY_DISTANCES
{
  NOT_SET,
	DAY,
	WEEK,
	ALL
}


export enum LOADING_POSITION_STATE
{
  NOT_SET,
	GPS_NOT_INSTALLED,
	GPS_NOT_AVAILABLE,
	RECEIVED_NEW_COORDINATES,
	RECEIVED_OLD_COORDINATES,
	NOT_RECEIVED,
	ERROR,
	ADDRESS_TEXT_LOADED
}

export enum CARWAY_LOG_TYPE
{
	NOT_SET,
	SUCCESS,
	INFO,
	ERROR
}
