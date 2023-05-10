//
// describe('AccessControlFormContainerComponent', () => {
//   let component: AccessControlFormContainerComponent<any>;
//   let fixture: ComponentFixture<AccessControlFormContainerComponent<any>>;
//
//   let bulkAccessConfigDataServiceMock: BulkAccessConfigDataService;
//
//   beforeEach(async () => {
//
//     bulkAccessConfigDataServiceMock = jasmine.createSpyObj('BulkAccessConfigDataService', {
//       findByName: jasmine.createSpy('findByName'),
//     });
//
//
//     await TestBed.configureTestingModule({
//       declarations: [ AccessControlFormContainerComponent ],
//       imports: [ CommonModule, ReactiveFormsModule, SharedBrowseByModule, TranslateModule, NgbDatepickerModule ],
//       providers: [
//         { provide: BulkAccessConfigDataService, useValue: bulkAccessConfigDataServiceMock },
//       // private bulkAccessControlService: BulkAccessControlService,
//       // private selectableListService: SelectableListService,
//       // protected modalService: NgbModal,
//       // private cdr: ChangeDetectorRef
//       ]
//     })
//     .compileComponents();
//   });
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AccessControlFormContainerComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
