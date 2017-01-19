/* * * Model for search service * * */
export class Resultlist {
    constructor(
        public weatherlist: {   pressure:string,
         humidity:string,
         description:string,
         iconname:string,
         maxtemp:string,
         mintemp:string,
         date:string,
         windspeed:string}, 
        public city: string      
        ){}
}