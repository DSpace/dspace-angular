import {
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';

import { AccessibilitySettingsService } from '../../accessibility/accessibility-settings.service';
import { getAccessibilitySettingsServiceStub } from '../../accessibility/accessibility-settings.service.stub';
import { UUIDService } from '../../core/shared/uuid.service';
import { LiveRegionService } from './live-region.service';

describe('liveRegionService', () => {
  let service: LiveRegionService;
  let accessibilitySettingsService: AccessibilitySettingsService;

  beforeEach(() => {
    accessibilitySettingsService = getAccessibilitySettingsServiceStub();

    accessibilitySettingsService.getAsNumber = jasmine.createSpy('getAsNumber').and.returnValue(of(100));

    service = new LiveRegionService(
      new UUIDService(),
      accessibilitySettingsService,
    );
  });

  describe('addMessage', () => {
    it('should correctly add messages', () => {
      expect(service.getMessages().length).toEqual(0);

      service.addMessage('Message One');
      expect(service.getMessages().length).toEqual(1);
      expect(service.getMessages()[0]).toEqual('Message One');

      service.addMessage('Message Two');
      expect(service.getMessages().length).toEqual(2);
      expect(service.getMessages()[1]).toEqual('Message Two');
    });
  });

  describe('clearMessages', () => {
    it('should clear the messages', () => {
      expect(service.getMessages().length).toEqual(0);

      service.addMessage('Message One');
      service.addMessage('Message Two');
      expect(service.getMessages().length).toEqual(2);

      service.clear();
      expect(service.getMessages().length).toEqual(0);
    });
  });

  describe('messages$', () => {
    it('should emit when a message is added and when a message is removed after the timeOut', fakeAsync(() => {
      const results: string[][] = [];

      service.getMessages$().subscribe((messages) => {
        results.push(messages);
      });

      expect(results.length).toEqual(1);
      expect(results[0]).toEqual([]);

      service.addMessage('message');

      tick();

      expect(results.length).toEqual(2);
      expect(results[1]).toEqual(['message']);

      tick(service.getMessageTimeOutMs());

      expect(results.length).toEqual(3);
      expect(results[2]).toEqual([]);
    }));

    it('should only emit once when the messages are cleared', fakeAsync(() => {
      const results: string[][] = [];

      service.getMessages$().subscribe((messages) => {
        results.push(messages);
      });

      expect(results.length).toEqual(1);
      expect(results[0]).toEqual([]);

      service.addMessage('Message One');
      service.addMessage('Message Two');

      tick();

      expect(results.length).toEqual(3);
      expect(results[2]).toEqual(['Message One', 'Message Two']);

      service.clear();
      tick(200);

      expect(results.length).toEqual(4);
      expect(results[3]).toEqual([]);
    }));

    it('should not pop messages added after clearing within timeOut period', fakeAsync(() => {
      // test expects a clear rate of 30 seconds
      accessibilitySettingsService.getAsNumber = jasmine.createSpy('getAsNumber').and.returnValue(of(30000));

      const results: string[][] = [];

      service.getMessages$().subscribe((messages) => {
        results.push(messages);
      });

      expect(results.length).toEqual(1);
      expect(results[0]).toEqual([]);

      service.addMessage('Message One');
      tick(10000);
      service.clear();
      tick(15000);
      service.addMessage('Message Two');

      // Message Two should not be cleared after 5 more seconds
      tick(5000);

      expect(results.length).toEqual(4);
      expect(results[3]).toEqual(['Message Two']);

      // But should be cleared 30 seconds after it was added
      tick(25000);
      expect(results.length).toEqual(5);
      expect(results[4]).toEqual([]);
    }));
  });

  describe('liveRegionVisibility', () => {
    it('should be false by default', () => {
      expect(service.getLiveRegionVisibility()).toBeFalse();
    });

    it('should correctly update', () => {
      service.setLiveRegionVisibility(true);
      expect(service.getLiveRegionVisibility()).toBeTrue();
      service.setLiveRegionVisibility(false);
      expect(service.getLiveRegionVisibility()).toBeFalse();
    });
  });
});
