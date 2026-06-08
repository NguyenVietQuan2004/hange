"use client";

import { useMasterDataStore } from "@/app/store/master-data-store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function MasterDataProvider() {
  const fetchAll = useMasterDataStore(useShallow((state) => state.fetchAll));

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return null;
}
