// React.FC 보다 JSX.Element 가 더 권장되는 방식의 타입
import React, { JSX } from 'react';

export const LeftArrowIcon: () => JSX.Element = () => {
  return (
    <>
      <path
        d='M11 19l-7-7 7-7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M20 12H4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </>
  );
};

export const RightArrowIcon: () => JSX.Element = () => {
  return (
    <>
      <path
        d='M13 5l7 7-7 7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M4 12h16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </>
  );
};

export const hambergerIcon: () => JSX.Element = () => {
  return (
    <path
      d='M4 6h16M4 12h16M4 18h16'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  );
};

export const DashboardIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <rect x='3' y='3' width='7' height='7' />
      <rect x='14' y='3' width='7' height='7' />
      <rect x='14' y='14' width='7' height='7' />
      <rect x='3' y='14' width='7' height='7' />
    </svg>
  );
};

export const VenueIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
      <line x1='3' y1='6' x2='21' y2='6' />
      <path d='M16 10a4 4 0 0 1-8 0' />
    </svg>
  );
};

export const ListIcon: () => JSX.Element = () => {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <line x1='8' y1='6' x2='21' y2='6' />
      <line x1='8' y1='12' x2='21' y2='12' />
      <line x1='8' y1='18' x2='21' y2='18' />
      <line x1='3' y1='6' x2='3.01' y2='6' />
      <line x1='3' y1='12' x2='3.01' y2='12' />
      <line x1='3' y1='18' x2='3.01' y2='18' />
    </svg>
  );
};

export const PlusIcon: () => JSX.Element = () => {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='8' x2='12' y2='16' />
      <line x1='8' y1='12' x2='16' y2='12' />
    </svg>
  );
};

export const EditorIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </svg>
  );
};

export const ExpandIcon: () => JSX.Element = () => {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <polyline points='9,18 15,12 9,6' />
    </svg>
  );
};

export const LogoIcon: () => JSX.Element = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
      <line x1='3' y1='6' x2='21' y2='6' />
      <path d='M16 10a4 4 0 0 1-8 0' />
      <circle cx='12' cy='13' r='2' fill='currentColor' />
    </svg>
  );
};

export const HamburgerIcon: () => JSX.Element = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='3' y1='6' x2='17' y2='6' />
      <line x1='3' y1='12' x2='17' y2='12' />
      <line x1='3' y1='18' x2='17' y2='18' />
    </svg>
  );
};

export const CloseIcon: () => JSX.Element = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='15' y1='5' x2='5' y2='15' />
      <line x1='5' y1='5' x2='15' y2='15' />
    </svg>
  );
};

export const VenueStatsIcon: () => JSX.Element = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='8' x2='12' y2='16' />
      <line x1='8' y1='12' x2='16' y2='12' />
    </svg>
  );
};

export const EventStatsIcon: () => JSX.Element = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
      <line x1='16' y1='2' x2='16' y2='6' />
      <line x1='8' y1='2' x2='8' y2='6' />
      <line x1='3' y1='10' x2='21' y2='10' />
    </svg>
  );
};

export const RevenueIcon: () => JSX.Element = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <line x1='12' y1='1' x2='12' y2='23' />
      <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
    </svg>
  );
};

export const VisitorIcon: () => JSX.Element = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
};

export const TrendUpIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <polyline points='23,6 13.5,15.5 8.5,10.5 1,18' />
      <polyline points='17,6 23,6 23,12' />
    </svg>
  );
};

export const TrendDownIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <polyline points='23,18 13.5,8.5 8.5,13.5 1,6' />
      <polyline points='17,18 23,18 23,12' />
    </svg>
  );
};

export const SmallArrowRightIcon: () => JSX.Element = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <line x1='5' y1='12' x2='19' y2='12' />
      <polyline points='12,5 19,12 12,19' />
    </svg>
  );
};
