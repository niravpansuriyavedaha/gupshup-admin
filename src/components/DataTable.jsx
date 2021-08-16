import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";
import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from "@material-ui/icons/FilterList";
// import { RateReviewSharp } from "@material-ui/icons";
import { Screens } from '../config/routes';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { withCheckbox, headCells } = props;
    const {
        // classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {withCheckbox && (
                        <Checkbox
                            indeterminate={
                                numSelected > 0 && numSelected < rowCount
                            }
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    )}
                </TableCell>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.disableSorting ? (
                            headCell.label
                        ) : (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : 'asc'
                                }
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {/* {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </span>
                                ) : null} */}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
              },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {
        numSelected,
        title,
        handleDeleteButtonClick,
        selected,
        setSelected,
    } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography
                    className={classes.title}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    className={classes.title}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title &&
                        title.length &&
                        title.map((item, index) => (
                            <item.component
                                key={index}
                                onClick={item.onClick.bind(this, item)}
                                label={item.label}
                                className={item.className || ''}
                            />
                        ))}
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton
                        onClick={handleDeleteButtonClick.bind(
                            this,
                            selected,
                            setSelected,
                        )}
                        aria-label="delete"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <></>
                // <Tooltip title="Filter list">
                //     <IconButton aria-label="filter list">
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        // minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function EnhancedTable(props) {
    const withPagination = props.withPagination || false;
    const { paginatedLength, paginatedHandler } = props;
    const withCheckbox = props.withCheckbox || false;
    const withToolbar = props.withToolbar === false ? false : true;
    const { columns, rows, title, onCheckboxSelect, handleDeleteButtonClick } =
        props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('');
    const [orderBy, setOrderBy] = React.useState('');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = [...Array(rows.length).keys()];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    useEffect(() => {
        if (withCheckbox) {
            onCheckboxSelect(selected);
        }
    }, [selected]);

    //#pagination to parent
    useEffect(() => {
        // console.log({ order, orderBy, page, rowsPerPage });
        if (withPagination) {
            paginatedHandler({ order, orderBy, page, rowsPerPage });
        }
    }, [order, orderBy, page, rowsPerPage]);

    const handleClick = (event, name, index) => {
        setSelected((prevState) => {
            if (prevState.indexOf(index) === -1) {
                return [...prevState, index];
            } else {
                let tempSelected = [...prevState];

                const itemIndex = tempSelected.indexOf(index);
                console.log(itemIndex);
                tempSelected.splice(itemIndex, 1);

                return tempSelected;
            }
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const handleChangeDense = (event) => {
    //     setDense(event.target.checked);
    // };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const generateView = (row, col, rowIndex, colIndex) => {
        let item = col.componentWithData;

        if (item) {
            switch (col.type) {
                case 'img':
                    return (
                        <item.component
                            src={row.image ? row.image.src : ''}
                            {...item.componentProps}
                        />
                    );

                case 'link':
                    return (
                        <item.component
                            props={{
                                ...item.componentProps,
                                to: {
                                    pathname: Screens.EDIT_PRODUCT,
                                    state: {
                                        _id: row._id,
                                    },
                                },
                            }}
                            label={row.title}
                        />
                    );
                case 'checkbox':
                    return <item.component value={row[col.id]} />;

                default:
                    return (
                        <item.component
                            onClick={item.onClick.bind(this, {
                                row,
                                col,
                                rowIndex,
                                colIndex,
                            })}
                            label={item.label}
                            {...item.componentProps}
                        />
                    );
            }
        } else {
            if (col.type === 'localeString')
                return new Date(row[col.id]).toLocaleString();
            return row[col.id];
        }
    };

    const rowData = withPagination
        ? rows
        : stableSort(rows, getComparator(order, orderBy)).slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage,
          );

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {withToolbar && (
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        title={title}
                        handleDeleteButtonClick={handleDeleteButtonClick}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            withCheckbox={withCheckbox}
                            headCells={columns}
                            classes={classes}
                            numSelected={selected.length}
                            order={order === '' ? 'asc' : order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* #pagination directly use Row */}
                            {rowData.map((row, index) => {
                                const isItemSelected = isSelected(index);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        // onClick={(event) =>
                                        //     handleClick(event, row.name)
                                        // }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            {withCheckbox && (
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby':
                                                            labelId,
                                                    }}
                                                    onClick={(event) =>
                                                        handleClick(
                                                            event,
                                                            row.name,
                                                            index,
                                                        )
                                                    }
                                                />
                                            )}
                                        </TableCell>

                                        {columns.map((ee, i) => (
                                            <TableCell
                                                align={
                                                    ee.numeric
                                                        ? 'right'
                                                        : 'left'
                                                }
                                                key={i}
                                            >
                                                {/* {row[ee.id]} */}
                                                {generateView(
                                                    row,
                                                    ee,
                                                    index,
                                                    i,
                                                )}
                                            </TableCell>
                                        ))}
                                        {/* <TableCell align="right" key={i}>
                                                {e}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.calories}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.fat}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.carbs}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.protein}
                                            </TableCell> */}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={withPagination ? paginatedLength : rows.length} //#pagination from parent
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {/* <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            /> */}
        </div>
    );
}
