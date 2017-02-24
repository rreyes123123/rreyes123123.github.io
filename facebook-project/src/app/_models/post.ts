import {FbApp} from './app';
import {FbPostType, FbStatusType} from './fb-post-type';
import {Profile} from './profile';
import {Place} from './place';
export class FbPagePost {
    constructor(
        public id: string,
        public admin_creator: Object[],
        public application: FbApp,
        public call_to_action: Object,
        public caption: string,
        public created_time: Date,
        public description: string,
        public feed_targetting: Object,
        public from: Profile,
        public icon: string,
        public instragram_eligibility:string,
        public is_hidden:boolean,
        public is_instagram_eligible: boolean,
        public is_published:boolean,
        public link: string,
        public message: string,
        public message_tags: Object[],
        public name:string,
        public object_id:string,
        public parent_id:string,
        public permalink_url:string,
        public picture:string,
        public place: Place, //custom object Place
        public privacy:Object,
        public properties:Object[],
        public shares: number,
        public source:string,
        public status_type:FbStatusType,
        public story:string,
//        public story_tags:
        public targeting:Object,
        public to:Profile[],
        public type: FbPostType,
        public update_time:Date,
        public with_tags: Object, // JSON object with data field of profile[]
        public pictureFile:File
    )
    { }
}