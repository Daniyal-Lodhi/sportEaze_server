import { Injectable } from '@nestjs/common';
import { Sport } from 'src/common/enums/sport/sport.enum';

@Injectable()
export class SportService {
  getAllSports() {
    return Object.values(Sport)
      .filter((id) => typeof id === 'number')
      .reduce((sports, id) => {
        const sportName = this.getSportNameById(id as number);
        sports[id] = sportName;
        return sports;
      }, {} as Record<number, string>);
  }

  private getSportNameById(id: number): string {
    const sportName = Object.keys(Sport).find(
      (key) => Sport[key as keyof typeof Sport] === id,
    );

    if (!sportName) return null;

    // Convert "TABLE_TENNIS" to "Table Tennis"
    return sportName
      .replace(/_/g, ' ') // Replace underscore with space
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }
}
