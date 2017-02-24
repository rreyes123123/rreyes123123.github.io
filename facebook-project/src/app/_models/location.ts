export class Location {
    constructor(
        public city:string,
        public country: string,
        public latitude: number,
        public longitude: number,
        public state: string,
        public street: string,
        public zip: string
    )
    { }
}