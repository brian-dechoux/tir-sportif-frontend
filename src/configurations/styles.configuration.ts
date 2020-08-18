import { customColors } from './theme.configuration';

export const deleteButton = {
  backgroundColor: customColors.red,
  color: customColors.white,
  '&:hover': {
    background: customColors.darkRed,
  }
}

export const tableHoveredRow = {
  '&:hover': {
    cursor: 'pointer',
  },
}
