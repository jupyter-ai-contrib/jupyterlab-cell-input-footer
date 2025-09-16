import { PanelLayout, Widget } from '@lumino/widgets';
import {
  Notebook,
  NotebookPanel,
  INotebookTracker
} from '@jupyterlab/notebook';

import { Cell } from '@jupyterlab/cells';

import { CELL_FOOTER_ID, CellFooterWidget } from './widget';

export function cellFromIndex(
  notebook: Notebook,
  idx: number
): Cell | undefined {
  const cellId = notebook.model?.cells.get(idx)?.id;
  if (cellId) {
    const cell = notebook._findCellById(cellId)?.cell;
    if (cell) {
      return cell;
    }
  }
}

export type ActiveNotebookCell = {
  cell: Cell | undefined;
  notebook: NotebookPanel | undefined;
};

export function findCell(
  cellId: string,
  notebookTracker: INotebookTracker
): ActiveNotebookCell {
  // First, try the current notebook in focuse
  const currentNotebook = notebookTracker.currentWidget;
  let cellMatch =
    notebookTracker.currentWidget?.content._findCellById(cellId)?.cell;
  if (currentNotebook && cellMatch) {
    return {
      cell: cellMatch,
      notebook: currentNotebook
    };
  }

  // Otherwise iterate through notebooks to find the cell.
  const notebookMatch = notebookTracker.find(notebook => {
    const cell = notebook.content._findCellById(cellId)?.cell;
    if (cell) {
      cellMatch = cell;
      return true;
    }
    return false;
  });
  return {
    cell: cellMatch,
    notebook: notebookMatch
  };
}

export function findCellFooter(cell: Cell): CellFooterWidget | undefined {
  const layout = cell?.layout as PanelLayout;
  // Dispose any old widgets attached to this cell.
  const oldWidget: Widget | undefined = layout.widgets.find(
    w => w.id === CELL_FOOTER_ID
  );
  return oldWidget as CellFooterWidget;
}
