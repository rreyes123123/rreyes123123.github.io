import { Component, Input } from '@angular/core';
import { FbPagePost } from '../_models/post';
@Component({
    selector: 'post-child',
    templateUrl: './post.component.html'
})
export class PostComponent
{
    @Input() post: FbPagePost;
    @Input('page') pageName: string;
}