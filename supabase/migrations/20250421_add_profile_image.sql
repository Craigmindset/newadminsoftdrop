-- Function to check if a column exists in a table
CREATE OR REPLACE FUNCTION get_columns(table_name text)
RETURNS TABLE (column_name text, data_type text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.column_name::text, c.data_type::text
  FROM information_schema.columns c
  WHERE c.table_name = get_columns.table_name
  AND c.table_schema = 'public';
END;
$$;

-- Function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = add_column_if_not_exists.table_name
    AND column_name = add_column_if_not_exists.column_name
    AND table_schema = 'public'
  ) INTO column_exists;

  IF NOT column_exists THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  add_column_if_not_exists.table_name, 
                  add_column_if_not_exists.column_name, 
                  add_column_if_not_exists.column_type);
  END IF;
END;
$$;
