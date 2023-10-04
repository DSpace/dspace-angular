import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileInfo, MetadataBitstream } from 'src/app/core/metadata/metadata-bitstream.model';
import { FileTreeViewComponent } from './file-tree-view.component';

describe('FileTreeViewComponent', () => {
  let component: FileTreeViewComponent;
  let fixture: ComponentFixture<FileTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeViewComponent);
    component = fixture.componentInstance;

    // Mock the node input value
    const fileInfo = new FileInfo();
    fileInfo.name = 'TestFolder';
    fileInfo.isDirectory = true;
    fileInfo.size = null;
    fileInfo.content = null; // add content property
    fileInfo.sub = {
      'TestSubFolder': {
        name: 'TestSubFolder',
        isDirectory: true,
        size: null,
        content: null, // add content property
        sub: null
      }
    };

    const metadataBitstream = new MetadataBitstream();
    metadataBitstream.fileInfo = [fileInfo];
    component.node = fileInfo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the node name', () => {
    waitForAsync(() => {
      const nodeNameElement = fixture.debugElement.query(By.css('#folderName')).nativeElement;
      expect(nodeNameElement.textContent).toContain('TestFolder');
    });
  });

  it('should correctly get the keys of the sub object', () => {
    expect(component.getKeys(component.node.sub)).toEqual(['TestSubFolder']);
  });
});
