import {GridReadyEvent} from 'ag-grid-community';

const DESKTOP_MIN_WIDTH = 768;

export function sizeColumnsToFitOnDesktop(event: GridReadyEvent) {
  if (window.innerWidth > DESKTOP_MIN_WIDTH) {
    event.api.sizeColumnsToFit();
  }
}
