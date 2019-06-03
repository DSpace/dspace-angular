export var defaultUUID = 'c4ce6905-290b-478f-979d-a333bbd7820f';
export function getMockUUIDService(uuid) {
    if (uuid === void 0) { uuid = defaultUUID; }
    return jasmine.createSpyObj('uuidService', {
        generate: uuid,
    });
}
//# sourceMappingURL=mock-uuid.service.js.map