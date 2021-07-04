import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengesService, ChallengeWithLinkedInformation, ReadableChallenge } from '../challenge-services/challenges.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  info?: ChallengeWithLinkedInformation;

  constructor(
    private _route: ActivatedRoute,
    private _challenges: ChallengesService,
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      if (params.c) {
        const challengeId = params.c;
        this._challenges.readChallengeWithLinkedInformation(challengeId).subscribe(ch => this.info = ch);
      }
    })
  }

}
