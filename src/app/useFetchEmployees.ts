import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { fetchEmployeesThunk } from './slices/employeeSlice';
import { useEffect } from 'react';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFetchEmployees = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.data);
  const loading = useAppSelector((state) => state.employees.loading);
  const error = useAppSelector((state) => state.employees.error);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  return { employees, loading, error };
};
