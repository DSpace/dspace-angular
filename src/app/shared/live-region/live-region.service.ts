import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiveRegionService {

  /**
   * The duration after which the messages disappear in milliseconds
   * @protected
   */
  protected messageTimeOutDurationMs: number = environment.liveRegion.messageTimeOutDurationMs;

  /**
   * Array containing the messages that should be shown in the live region
   * @protected
   */
  protected messages: string[] = [];

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
  getMessages() {
    return [...this.messages];
  }

  /**
   * Returns the BehaviorSubject emitting the array with messages every time the array updates
   */
  getMessages$() {
    return this.messages$;
  }

  /**
   * Adds a message to the live-region messages array
   * @param message
   */
  addMessage(message: string) {
    this.messages.push(message);
    this.emitCurrentMessages();

    // Clear the message once the timeOut has passed
    setTimeout(() => this.pop(), this.messageTimeOutDurationMs);
  }

  /**
   * Clears the live-region messages array
   */
  clear() {
    this.messages = [];
    this.emitCurrentMessages();
  }

  /**
   * Removes the longest living message from the array.
   * @protected
   */
  protected pop() {
    if (this.messages.length > 0) {
      this.messages.shift();
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
