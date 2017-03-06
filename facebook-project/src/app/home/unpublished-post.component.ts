import { Component, Input } from '@angular/core';
import { PromotableFbPagePost } from '../_models/promotable-post';
@Component({
    selector: 'unpublished-post-child',
    templateUrl: './unpublished-post.component.html'
})
export class UnpublishedPostComponent
{
    @Input() post: PromotableFbPagePost;
    // @Input('page') pageName: string;
}