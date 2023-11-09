import { useCallback, useState, ChangeEvent } from "react";

const useInput = (
  initialValue: string | null = null
): [string, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState<string | null>(initialValue);

  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return [value || "", handler];
};

export default useInput;
