// src/utils/getStatusBg.ts

export function getStatusBg(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-500';
      case 'VALIDATED':
        return 'bg-amber-500';
      case 'REVIEWED':
        return 'bg-blue-500';
      case 'APPROVED':
        return 'bg-green-600';
      case 'PART-PAY':
        return 'bg-orange-500';
      case 'PAID':
        return 'bg-green-700';
      case 'DECLINED':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  }