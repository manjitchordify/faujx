export enum NodeStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum NodeType {
  Module = 'module',
  Topic = 'topic',
  Assignment = 'assignment',
  Root = 'root',
}

export type NodeItemStatus =
  | NodeStatus.NotStarted
  | NodeStatus.InProgress
  | NodeStatus.Completed;

export type NodeItemType =
  | NodeType.Module
  | NodeType.Topic
  | NodeType.Assignment
  | NodeType.Root;

export type NodeItemData = {
  label: string;
  isCompleted: boolean;
  status: NodeItemStatus;
  description: string;
  dir?: 'R' | 'L'; // Direction for handles
  resources?: {
    free: string[];
    premium: string[];
  };
};

export type NodeItem = {
  id: string;
  type: NodeItemType;
  data: NodeItemData;
  width: number;
  height: number;
  position: { x: number; y: number };
};

export type NodeEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: { [key: string]: string | number };
};

export type RoadmapItem = NodeItem & {
  topics?: NodeItem[];
  assignments?: NodeItem[];
};
