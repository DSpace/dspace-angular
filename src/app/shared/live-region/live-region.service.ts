import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UUIDService } from '../../core/shared/uuid.service';

/**
 * The LiveRegionService is responsible for handling the messages that are shown by the {@link LiveRegionComponent}.
 * Use this service to add or remove messages to the Live Region.
 */
@Injectable({
  providedIn: 'root',
})
export class LiveRegionService {

  constructor(
    protected uuidService: UUIDService,
  ) {
  }

  /**
   * The duration after which the messages disappear in milliseconds
   * @protected
   */
  protected messageTimeOutDurationMs: number = environment.liveRegion.messageTimeOutDurationMs;

  /**
   * Array containing the messages that should be shown in the live region,
   * together with a uuid, so they can be uniquely identified
   * @protected
   */
  protected messages: { message: string, uuid: string }[] = [];

  /**
   * BehaviorSubject emitting the array with messages every time the array updates
   * @protected
   */
  protected messages$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  /**
   * Whether the live region should be visible
   * @protected
   */
  protected liveRegionIsVisible: boolean = environment.liveRegion.isVisible;

  /**
   * Returns a copy of the array with the current live region messages
   */
  getMessages(): string[] {
    return this.messages.map(messageObj => messageObj.message);
  }

  /**
   * Returns the BehaviorSubject emitting the array with messages every time the array updates
   */
  getMessages$(): BehaviorSubject<string[]> {
    return this.messages$;
  }

  /**
   * Adds a message to the live-region messages array
   * @param message
   * @return The uuid of the message
   */
  addMessage(message: string): string {
    const uuid = this.uuidService.generate();
    this.messages.push({ message, uuid });
    setTimeout(() => this.clearMessageByUUID(uuid), this.messageTimeOutDurationMs);
    this.emitCurrentMessages();
    return uuid;
  }

  /**
   * Clears the live-region messages array
   */
  clear() {
    this.messages = [];
    this.emitCurrentMessages();
  }

  /**
   * Removes the message with the given UUID from the messages array
   * @param uuid The uuid of the message to clear
   */
  clearMessageByUUID(uuid: string) {
    const index = this.messages.findIndex(messageObj => messageObj.uuid === uuid);

    if (index !== -1) {
      this.messages.splice(index, 1);
      this.emitCurrentMessages();
    }
  }

  /**
   * Makes the messages$ BehaviorSubject emit the current messages array
   * @protected
   */
  protected emitCurrentMessages() {
    this.messages$.next(this.getMessages());
  }

  /**
   * Returns a boolean specifying whether the live region should be visible.
   * Returns 'true' if the region should be visible and false otherwise.
   */
  getLiveRegionVisibility(): boolean {
    return this.liveRegionIsVisible;
  }

  /**
   * Sets the visibility of the live region.
   * Setting this to true will make the live region visible which is useful for debugging purposes.
   * @param isVisible
   */
  setLiveRegionVisibility(isVisible: boolean) {
    this.liveRegionIsVisible = isVisible;
  }

  /**
   * Gets the current message timeOut duration in milliseconds
   */
  getMessageTimeOutMs(): number {
    return this.messageTimeOutDurationMs;
  }

  /**
   * Sets the message timeOut duration
   * @param timeOutMs the message timeOut duration in milliseconds
   */
  setMessageTimeOutMs(timeOutMs: number) {
    this.messageTimeOutDurationMs = timeOutMs;
  }
}
