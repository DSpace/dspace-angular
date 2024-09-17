import { LiveRegionService } from './live-region.service';
import { fakeAsync, tick, flush } from '@angular/core/testing';

describe('liveRegionService', () => {
  let service: LiveRegionService;


  beforeEach(() => {
    service = new LiveRegionService();
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
      flush();

      expect(results.length).toEqual(4);
      expect(results[3]).toEqual([]);
    }));

    it('should respect configured timeOut', fakeAsync(() => {
      const results: string[][] = [];

      service.getMessages$().subscribe((messages) => {
        results.push(messages);
      });

      expect(results.length).toEqual(1);
      expect(results[0]).toEqual([]);

      const timeOutMs = 500;
      service.setMessageTimeOutMs(timeOutMs);

      service.addMessage('Message One');
      tick(timeOutMs - 1);

      expect(results.length).toEqual(2);
      expect(results[1]).toEqual(['Message One']);

      tick(1);

      expect(results.length).toEqual(3);
      expect(results[2]).toEqual([]);

      const timeOutMsTwo = 50000;
      service.setMessageTimeOutMs(timeOutMsTwo);

      service.addMessage('Message Two');
      tick(timeOutMsTwo - 1);

      expect(results.length).toEqual(4);
      expect(results[3]).toEqual(['Message Two']);

      tick(1);

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
