import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { StoryBarComponent } from '../../components/story-bar/story-bar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostItemComponent, StoryBarComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.postService.loadFeed();
  }
}
