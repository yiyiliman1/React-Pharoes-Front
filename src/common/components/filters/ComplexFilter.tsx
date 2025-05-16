import { Checkbox } from "@mui/material";
import React, { useEffect } from "react";

type Props = {
  children?: React.ReactChild | React.ReactChild[];
  onChangeType?: (type: any) => void;
};

export const ComplexFilter = ({ children, onChangeType }: Props) => {
  const [complexValue, setComplexValue] = React.useState<boolean>(false);
  const [profileValue, setProfileValue] = React.useState<boolean>(false);

  useEffect(() => {
    onChangeType && onChangeType({ complex: complexValue, profile: profileValue });
  }, [complexValue, profileValue]);

  const onChangeComplex = (_event: any, checked: boolean) => {
    setComplexValue(checked);
  };
  const onChangeProfile = (_event: any, checked: boolean) => {
    setProfileValue(checked);
  };

  return (
    <div className="complex-filter">
      <div className="complex-filter_children">{children}</div>
      <div className="complex-filter_radio-container">
        <div className="complex-filter-item">
          <Checkbox size="small" onChange={onChangeComplex} />
          Exclude complex
        </div>
        <div className="complex-filter-item">
          <Checkbox size="small" onChange={onChangeProfile} />
          Exclude profiles
        </div>
      </div>
    </div>
  );
};
