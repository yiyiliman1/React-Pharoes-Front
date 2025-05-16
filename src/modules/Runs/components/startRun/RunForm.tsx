import * as yup from "yup";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { RunDetails, RunFormData } from "../../types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRuns } from "../../hooks/useRuns";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";

type Props = {
  onSubmit?: (values: RunFormData) => Promise<void>;
  onEnd?: () => Promise<void>;
  edit?: boolean;
  running?: boolean;
  defaultValues?: RunFormData;
  runDetails?: RunDetails;
  disabled?: boolean;
};

const Form = {
  Name: {
    name: "name",
    label: "Run name",
    validator: yup.string().required(),
  },
  Execution: {
    name: "execution",
    label: "Execution",
    validator: yup.string().required(),
  },
  MaxTime: {
    name: "maxTime",
    label: "Max. time (minutes)",
    validator: yup.number().positive().integer().required(),
  },
  Tolerance: {
    name: "tolerance",
    label: "Tolerance",
    validator: yup.number().positive().required(),
  },
};

export const RunForm = ({
  edit,
  disabled,
  running,
  onSubmit,
  onEnd,
  defaultValues,
  runDetails,
}: Props) => {
  const resolver = yupResolver(
    yup
      .object({
        [Form.Name.name]: edit
          ? Form.Name.validator.notRequired()
          : Form.Name.validator,
        [Form.Execution.name]: edit
          ? Form.Execution.validator.notRequired()
          : Form.Execution.validator,
        [Form.MaxTime.name]:
          edit && !running
            ? Form.MaxTime.validator.notRequired()
            : Form.MaxTime.validator,
        [Form.Tolerance.name]:
          edit && !running
            ? Form.Tolerance.validator.notRequired()
            : Form.Tolerance.validator,
      })
      .required()
  );
  const { getExecutionsQuery } = useRuns();
  const [submitting, setSubmitting] = useState(false);
  const [ending, setEnding] = useState(false);

  const executions = getExecutionsQuery.data || [];
  const isDisabled = disabled || submitting || ending;

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const ensureMount = (exec: VoidFunction) => {
    if (!mounted.current) return;
    exec();
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({ resolver });
  const submitLabel = edit ? "UPDATE RUN" : "START RUN";

  const onSubmitForm = async (data: RunFormData) => {
    try {
      ensureMount(() => setSubmitting(true));
      await onSubmit?.(data);
    } finally {
      ensureMount(() => setSubmitting(false));
    }
  };

  const onClickEndButton = async () => {
    try {
      ensureMount(() => setEnding(true));
      await onEnd?.();
    } finally {
      ensureMount(() => setEnding(false));
    }
  };

  useEffect(() => {
    reset({
      [Form.Name.name]: runDetails?.name,
      [Form.MaxTime.name]: runDetails?.timemax,
      [Form.Tolerance.name]: runDetails?.tolerance,
    });
    if (runDetails?.executionid) setValue("execution", runDetails?.executionid);
  }, [runDetails]);

  const selectExecutionComponent = executions.map((item) => (
    <MenuItem key={item.id} value={item.id}>
      {item.name}
    </MenuItem>
  ));

  // if (edit) {
  //   selectExecutionComponent.unshift(
  //     <MenuItem key={1} value="loading">
  //       Loading...
  //     </MenuItem>
  //   );
  // }

  return (
    <form className="start-run-form" onSubmit={handleSubmit(onSubmitForm)}>
      <FormControl fullWidth>
        <TextField
          error={errors.name}
          label={Form.Name.label}
          helperText={errors.name?.message}
          disabled={isDisabled || edit}
          {...register(Form.Name.name)}
          defaultValue={defaultValues?.name}
          inputProps={{
            maxLength: 30,
          }}
        />
      </FormControl>

      <FormControl fullWidth error={errors.execution}>
        <InputLabel id="executionLabel">{Form.Execution.label}</InputLabel>
        <Controller
          control={control}
          name="execution"
          defaultValue=""
          render={({ field: { name, value, onChange } }) => {
            return (
              <Select
                onChange={onChange}
                value={value}
                defaultValue={value}
                label={Form.Execution.label}
                disabled={isDisabled || executions.length === 0 || edit}
                labelId="executionLabel"
                id={name}
              >
                {selectExecutionComponent}
              </Select>
            );
          }}
        />

        <FormHelperText>{errors.execution?.message}</FormHelperText>
      </FormControl>

      <FormControl fullWidth>
        <TextField
          defaultValue={defaultValues?.maxTime}
          error={errors.maxTime}
          label={Form.MaxTime.label}
          {...register(Form.MaxTime.name)}
          helperText={errors.maxTime?.message}
          disabled={isDisabled || (edit && !running)}
          inputProps={{
            step: 1,
            min: 1,
            type: "number",
          }}
        />
      </FormControl>

      <FormControl fullWidth>
        <TextField
          defaultValue={defaultValues?.tolerance}
          error={errors.tolerance}
          label={Form.Tolerance.label}
          {...register(Form.Tolerance.name)}
          helperText={errors.tolerance?.message}
          inputProps={{
            step: 0.0001,
            min: 0.0001,
            max: 0.2,
            type: "number",
          }}
          disabled={isDisabled || (edit && !running)}
        />
      </FormControl>

      <FormControl fullWidth>
        <div className="start-run-form__buttons">
          <LoadingButton
            loading={submitting}
            variant="contained"
            type="submit"
            size="large"
            disabled={disabled || ending || (edit && !running)}
          >
            {submitLabel}
          </LoadingButton>
          {edit && (
            <LoadingButton
              loading={ending}
              variant="outlined"
              size="large"
              onClick={onClickEndButton}
              disabled={disabled || submitting || (edit && !running)}
            >
              END RUN
            </LoadingButton>
          )}
        </div>
      </FormControl>
    </form>
  );
};
