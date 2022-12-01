import { TableCell, TableHead, TableRow } from "@mui/material";

interface ListHeaderProps {
  labels: Array<string>;
}

export default function ListHeader({ labels }: ListHeaderProps): JSX.Element {
  return (
    <TableHead>
      <TableRow>
        {labels.map((label, idx) => (
          <TableCell key={idx} align="left">
            {label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
