export class Place {
    constructor(
        public category:string,
        public category_list: string[],
        public location: Location,
        public name,
        public id
    )
    { }
}