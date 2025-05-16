import { Link } from "@mui/material";
import { useEffect } from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { DataGrid } from "../../../common/components/DataGrid";
import { Profile } from "../types";
import { useProfilesContext } from "../context/ProfilesContext";

export const ProfilesDataGrid = () => {
  const ctx = useProfilesContext();

  useEffect(() => {
    ctx.query.refetch();
  }, []);

  const fileComponent = (value: string) => (
    <Link className="is-file" underline="none">
      <InsertDriveFileOutlinedIcon />
      {value}
    </Link>
  );

  const formattedProfiles = (ctx.query.data || []).map(profile => {
    // if (profile.Date) {
    if (profile.Date && profile.Date !== '-') {
      const [datePart, timePart] = profile.Date.split('T');    
      const formattedDate = datePart.replace(',', ' ') + ' ' + timePart.slice(0, 8);
      return {
        ...profile,
        Date: formattedDate
      } as Profile;
    }
    return profile;
  });

  return (
    <DataGrid
      data={formattedProfiles}
      onChangeSelectedItems={ctx.selection.selectItems}
      paginatedQuery={ ctx }
      idName={"Id"}
      noDataText="There are no profiles."
      loadingText="Loading profiles..."
      columns={
        [
          { field: 'Name', headerName: 'Name', flex: 1, minWidth: 120, sortable: false },
          { field: 'Sourcefile', headerName: 'Source File or Formula', flex: 1, minWidth: 160, sortable: false, renderCell: params => {
            return params.row.Sourcefile 
              ? fileComponent(params.row.Sourcefile) 
              : <span className="is-formula">{ params.row.Formula }</span>;
          }},
          { field: 'Rule', headerName: 'Rule', flex: 0, minWidth: 140, sortable: false, cellClassName: "is-rule" },
          { field: 'Size', headerName: 'Size (kb)', flex: 1, minWidth: 120, sortable: false },
          //{ field: 'Date', headerName: 'Last Updated', flex: 0, minWidth: 180, sortable: false, headerAlign: "right", align: "right" },
          { field: 'Date', headerName: 'Last Updated', flex: 0, minWidth: 180, sortable: false},
          { field: 'Comments', headerName: 'Comments', flex: 1, type: 'time', minWidth: 180, sortable: false, cellClassName: "is-comment" }
        ]
      } 
    />
  );
};
