import { Button, ButtonGroup } from '@blueprintjs/core';
import { useMemo } from 'react';

const PAGE_SIZE = 50;

/**
 * Pagination bar with previous/next buttons and page number buttons.
 * @param {object} props
 * @param {number} props.offset - Current offset (0-based).
 * @param {number} props.total - Total number of items.
 * @param {(offset: number) => void} props.onOffsetChange - Called when offset changes.
 */
export function Pagination(props) {
  const { offset, total, onOffsetChange } = props;

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 5);
    const end = Math.min(totalPages, currentPage + 5);
    for (let page = start; page <= end; page++) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const firstPage = pageNumbers[0];
  const lastPage = pageNumbers.at(-1);

  const buttons = [];

  if (firstPage > 1) {
    buttons.push(
      <Button
        key="first"
        size="small"
        variant="minimal"
        onClick={() => onOffsetChange(0)}
      >
        1
      </Button>,
    );
    if (firstPage > 2) {
      buttons.push(
        <Button key="start-ellipsis" size="small" variant="minimal" disabled>
          …
        </Button>,
      );
    }
  }

  for (const page of pageNumbers) {
    buttons.push(
      <Button
        key={page}
        size="small"
        variant={page === currentPage ? 'outlined' : 'minimal'}
        intent={page === currentPage ? 'primary' : 'none'}
        onClick={() => onOffsetChange((page - 1) * PAGE_SIZE)}
      >
        {page}
      </Button>,
    );
  }

  if (lastPage < totalPages) {
    if (lastPage < totalPages - 1) {
      buttons.push(
        <Button key="end-ellipsis" size="small" variant="minimal" disabled>
          …
        </Button>,
      );
    }
    buttons.push(
      <Button
        key="last"
        size="small"
        variant="minimal"
        onClick={() => onOffsetChange((totalPages - 1) * PAGE_SIZE)}
      >
        {totalPages}
      </Button>,
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 0',
      }}
    >
      <Button
        size="small"
        variant="minimal"
        icon="chevron-left"
        disabled={currentPage === 1}
        onClick={() => onOffsetChange(Math.max(0, offset - PAGE_SIZE))}
      />
      <ButtonGroup>{buttons}</ButtonGroup>
      <Button
        size="small"
        variant="minimal"
        icon="chevron-right"
        disabled={currentPage === totalPages}
        onClick={() => onOffsetChange(offset + PAGE_SIZE)}
      />
    </div>
  );
}

export { PAGE_SIZE };
