import { Item } from '../../shared/item.model';

export interface WorkspaceitemSectionDetectDuplicateObject {
  matches: {
    [itemId: string]: DetectDuplicateMatch;
  };
}

export interface DetectDuplicateMatch {
  submitterDecision?: string; // [reject|verify]
  submitterNote?: string;
  submitterTime?: string; // (readonly)

  workflowDecision?: string; // [reject|verify]
  workflowNote?: string;
  workflowTime?: string; // (readonly)

  adminDecision?: string;

  matchObject?: Item;
}
