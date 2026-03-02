import React from "react";
import {
  DataGrid,
  Column,
  Paging,
  Pager,
  FilterRow,
  SearchPanel,
  Export,
  Toolbar,
  Item,
  Selection,
} from "devextreme-react/data-grid";
import type { DataType } from "devextreme/common";
import ExcelJS from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import "devextreme/dist/css/dx.light.css";
import { saveAs } from "file-saver";

export interface DevExpressTableProps {
  dataSource: any;
  columns: {
    dataField: string;
    caption?: string;
    dataType?: DataType;
    width?: number | string;
    [key: string]: any;
  }[];
  pageSize?: number;
  allowExport?: boolean;
  allowSearch?: boolean;
  allowFilter?: boolean;
  showPager?: boolean;
  // new props for checkbox selection
  allowSelectionCheckboxes?: boolean;
  selectedRowKeys?: any[];
  onSelectionChanged?: (
    selectedRowsData: any[],
    selectedRowKeys?: any[]
  ) => void;
  [key: string]: any;
}

const DevExpressTable: React.FC<
  DevExpressTableProps & {
    showSerialNumber?: boolean;
    serialNumberCaption?: string;
  }
> = ({
  dataSource,
  columns,
  pageSize = 10,
  allowExport = true,
  allowSearch = true,
  allowFilter = true,
  showPager = true,
  showSerialNumber = true,
  serialNumberCaption = "S/N",
  allowSelectionCheckboxes = false,
  selectedRowKeys,
  onSelectionChanged,
  ...rest
}) => {
  const onExporting = (e: any) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Data.xlsx"
        );
      });
    });
    e.cancel = true; // Prevent default export behavior
  };

  // Calculate the serial number for each row
  const renderSerialNumber = (row: any) => {
    const gridInstance = row.component;
    const pageIndex = gridInstance?.pageIndex?.() ?? 0;
    const pageSizeValue = gridInstance?.pageSize?.() ?? pageSize;
    return pageIndex * pageSizeValue + (row.rowIndex + 1);
  };

  const primaryColor = "#003d14";
  // styling the header cells
  const headerCellStyle = {
    padding: "12px 8px",
    background: primaryColor,
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: 600,
    topBorderRadius: "8px",
  };
  const onCellPrepared = (e: any) => {
    if (e.rowType === "header") {
      Object.assign(e.cellElement.style, headerCellStyle);
    }
  };

  // selection change forwarder
  const handleSelectionChanged = (e: any) => {
    onSelectionChanged?.(
      e.selectedRowsData,
      e.selectedRowKeys ?? e.currentSelectedRowKeys
    );
  };

  //styling the pager and paging buttons
  React.useEffect(() => {
    const pager = document.createElement("style");
    const paging = document.createElement("style");
    const searchBar = document.createElement("style");
    const exportButtonStyle = document.createElement("style");
    const tableStyle = document.createElement("style");
    pager.innerHTML = `
      /* Style pager arrows */
      .dx-pager .dx-navigate-button:not(.dx-state-disabled) .dx-icon {
        color: ${primaryColor} !important;
      }
      /* Style active page number */
      .dx-pager .dx-page.dx-selection {
        background: ${primaryColor} !important;
        color: #fff !important;
        border-radius: 4px;
      }
    `;
    paging.innerHTML = `
      /* Style active paging button */
      .dx-page-sizes .dx-selection, .dx-page-sizes.dx-selection:focus, .dx-page-sizes.dx-selection:hover {
        background: ${primaryColor} !important;
        color: #fff !important;
        border-radius: 4px;
      }
    `;
    searchBar.innerHTML = `
    /* Style the search bar input */
    .dx-datagrid-search-panel input.dx-texteditor-input {
      padding: 12px 15px !important;
      padding-left: 30px !important;
      font-size: 0.875rem;
      color: #333;
      border: 1px solid ${primaryColor} !important;
      background-color: #fff;
      box-shadow: none;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #ccc;
      transition: border-color 0.2s;
    }
    .dx-datagrid-search-panel input.dx-texteditor-input:focus {
      border: 2px solid ${primaryColor} !important;
      outline: none !important;
      box-shadow: 0 0 0 2px rgba(0,61,20,0.08);
    }
    `;
    exportButtonStyle.innerHTML = `
    /* Style the export button */
    .dx-datagrid-export-button {
      padding: 3px !important;
      border: 1.5px solid ${primaryColor} !important;
      border-radius: 4px !important;
      background: #fff !important;
      color: ${primaryColor} !important;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      transition: background 0.2s, border-color 0.2s;
    }
    .dx-datagrid-export-button:hover, .dx-datagrid-export-button:focus {
      background: #f3f7f4 !important;
      border-color: #005c1a !important;
      color: #005c1a !important;
    }
    /* Style the export icon */
    .dx-datagrid-export-button .dx-icon {
      color: ${primaryColor} !important;
      font-size: 1.25rem !important;
    }
    /* Use a modern Excel icon (FontAwesome) if available */
    .dx-datagrid-export-button .dx-icon-export {
      mask: url('data:image/svg+xml;utf8,<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="14" height="18" x="5" y="3" rx="2" fill="%2300b050"/><path d="M9 14l3 3 3-3M12 17V7" stroke="%23fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>') no-repeat center;
      -webkit-mask: url('data:image/svg+xml;utf8,<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="14" height="18" x="5" y="3" rx="2" fill="%2300b050"/><path d="M9 14l3 3 3-3M12 17V7" stroke="%23fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>') no-repeat center;
      background-color: ${primaryColor} !important;
      width: 1.25em;
      height: 1.25em;
      color: transparent !important;
    }
    `;
    tableStyle.innerHTML = `
    /* Add border radius to the table */
    .dx-datagrid .dx-datagrid-headers,
    .dx-datagrid .dx-datagrid-rowsview,
    .dx-datagrid .dx-datagrid-total-footer,
    .dx-datagrid .dx-datagrid-pager {
      border-radius: 8px !important;
      overflow: hidden;
    }
    .dx-datagrid .dx-datagrid-headers {
      border-top-left-radius: 8px !important;
      border-top-right-radius: 8px !important;
    }
    .dx-datagrid .dx-datagrid-rowsview {
      border-bottom-left-radius: 8px !important;
      border-bottom-right-radius: 8px !important;
    }
    .dx-datagrid {
      border-radius: 8px !important;
      overflow: hidden;
    }
    `;
    document.head.appendChild(pager);
    document.head.appendChild(paging);
    document.head.appendChild(searchBar);
    document.head.appendChild(exportButtonStyle);
    document.head.appendChild(tableStyle);
    return () => {
      document.head.removeChild(pager);
      document.head.removeChild(paging);
      document.head.removeChild(searchBar);
      document.head.removeChild(exportButtonStyle);
      document.head.removeChild(tableStyle);
    };
  }, []);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        dataSource={dataSource}
        remoteOperations={true}
        showBorders={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        rowAlternationEnabled={true}
        wordWrapEnabled={true}
        onCellPrepared={onCellPrepared}
        onExporting={allowExport ? onExporting : undefined}
        onSelectionChanged={
          allowSelectionCheckboxes ? handleSelectionChanged : undefined
        }
        selectedRowKeys={selectedRowKeys}
        {...rest}
        style={{ minWidth: `${columns.length > 5 ? "1200px" : "700px"}` }} // set a minWidth so columns don't collapse too much
      >
        {allowSelectionCheckboxes && (
          <Selection mode="multiple" showCheckBoxesMode="always" />
        )}

        {showSerialNumber && (
          <Column
            caption={serialNumberCaption}
            width={70}
            cellRender={(row: any) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {renderSerialNumber(row)}
              </div>
            )}
            allowSorting={true}
            allowFiltering={true}
            allowExporting={true}
          />
        )}
        {columns.map((col) => (
          <Column key={col.dataField} {...col} />
        ))}

        {rest.actions && (
          <Column
            caption="Actions"
            width={rest.actionsWidth || 120}
            cellRender={({ data, rowIndex }: any) => (
              <div style={{ display: "flex", gap: 8 }}>
                {rest.actions.map((action: any, idx: number) => (
                  <React.Fragment key={idx}>
                    {typeof action.render === "function" ? (
                      action.render({ data, rowIndex })
                    ) : (
                      <button
                        style={action.style}
                        className={action.className}
                        onClick={() => action.onClick?.(data, rowIndex)}
                        disabled={action.disabled}
                        title={action.title}
                      >
                        {action.icon && (
                          <span style={{ marginRight: 4 }}>{action.icon}</span>
                        )}
                        {action.label}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            allowSorting={false}
            allowFiltering={false}
            allowExporting={false}
            fixed={rest.actionsFixed}
            fixedPosition={rest.actionsFixedPosition}
          />
        )}

        {allowFilter && <FilterRow visible={true} />}
        {allowSearch && (
          <SearchPanel visible={true} width={240} placeholder="Search..." />
        )}
        {allowExport && (
          <Export enabled={true} allowExportSelectedData={false} />
        )}
        <Toolbar>
          {allowExport && <Item name="exportButton" location="after" />}
          <Item name="searchPanel" location="after" />
        </Toolbar>
        <Paging defaultPageSize={pageSize} />
        {showPager && (
          <Pager
            visible={true}
            allowedPageSizes={[5, 10, 20, 50, 100]}
            showPageSizeSelector={true}
            showNavigationButtons={true}
          />
        )}
      </DataGrid>
    </div>
  );
};

export default DevExpressTable;
