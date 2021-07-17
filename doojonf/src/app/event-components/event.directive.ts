import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {
  Event,
  EventType,
  PostCreatedEvent,
} from '../event-services/events.service';
import { PostCreatedComponent } from './post-created/post-created.component';

@Directive({
  selector: '[appEvent]',
})
export class EventDirective implements OnInit {
  @Input()
  event!: Event;

  constructor(
    public _view: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const type = this.event.type;

    switch (type) {
      case EventType.POST_CREATED:
        this._handlePostCreated();
        break;
    }
  }

  private _handlePostCreated() {
    const factory =
      this._componentFactoryResolver.resolveComponentFactory(
        PostCreatedComponent
      );

    this._view.clear();
    const componentRef = this._view.createComponent(factory);
    componentRef.instance.event = this.event as PostCreatedEvent;
  }
}
