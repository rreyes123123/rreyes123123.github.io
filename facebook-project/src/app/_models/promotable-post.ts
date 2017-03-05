import {FbApp} from './app';
import {FbPostType, FbStatusType} from './fb-post-type';
import {Profile} from './profile';
import {Place} from './place';

export class Image {
    constructor(
        public src: string
    ){}    
}

export class Media {
    constructor(
        public image: Image
    ){}    
}
export class Attachments {
    constructor(
        public data: Media[],
        public subattachments: Attachments
    ){}
}

export class PromotableFbPagePost {
    constructor(
        public message: string,
        public created_time: Date,
        public scheduled_publish_time: Date,
        public place: Place,
        // public place: string, //id
        public application: FbApp,
        public from: Profile,
        public is_hidden: boolean,
        public is_published: boolean,
        public permalink_url: string,
        public privacy: Object,
        public status_type: FbStatusType,
        public story: string,
        public story_tags: Object[],
        public update_time: Date,
        public pictureFile: File,
        public attachments: Attachments
    )
    { }
}